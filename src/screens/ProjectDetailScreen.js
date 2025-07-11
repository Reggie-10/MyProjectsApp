import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, HelperText, Title } from 'react-native-paper';

import { loadData, saveData } from '../utils/storage';
import TaskItem from '../components/TaskItem';

export default function ProjectDetailScreen() {
  const { projectId } = useRoute().params;
  const navigation = useNavigation();
  const shouldBlockNavigation = useRef(true);

  const [project, setProject] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load the project
  useEffect(() => {
    const fetchProject = async () => {
      const allProjects = await loadData('projects');
      const selected = allProjects.find(p => p.id === projectId);
      if (selected) setProject(selected);
    };
    fetchProject();
  }, [projectId]);

  // Confirm before leaving with unsaved changes
  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = (e) => {
        if (!hasUnsavedChanges || !shouldBlockNavigation.current) return;
        e.preventDefault();

        Alert.alert(
          'Save Changes?',
          'You have unsaved changes. Do you want to save before leaving?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
            {
              text: 'Save',
              onPress: async () => {
                await saveProject(project);
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      };

      const unsubscribe = navigation.addListener('beforeRemove', handleBeforeRemove);
      return unsubscribe;
    }, [hasUnsavedChanges, project, navigation])
  );

  const saveProject = async (updatedProject) => {
    const allProjects = await loadData('projects');
    const updatedList = allProjects.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );
    await saveData('projects', updatedList);
    setProject(updatedProject);
    setHasUnsavedChanges(false);
  };

  const addTask = () => {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setShowError(true);
      return;
    }

    const exists = project.tasks.some(
      task => task.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (exists) {
      Alert.alert('Duplicate Task', 'A task with this title already exists.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: trimmedTitle,
      completed: false,
    };

    updateProjectTasks([newTask, ...project.tasks]);
    setTaskTitle('');
    setShowError(false);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateProjectTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = project.tasks.filter(task => task.id !== taskId);
            updateProjectTasks(updatedTasks);
          },
        },
      ]
    );
  };

  const updateProjectTasks = (newTasks) => {
    setProject(prev => ({
      ...prev,
      tasks: newTasks,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAndGoBack = async () => {
    shouldBlockNavigation.current = false;
    await saveProject(project);
    navigation.goBack();
  };

  if (!project) return null;

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Title style={{ marginBottom: 16, textAlign: 'center' }}>{project.title}</Title>

      <TextInput
        label="Task Title"
        value={taskTitle}
        onChangeText={(text) => {
          setTaskTitle(text);
          if (showError) setShowError(false);
        }}
        error={showError}
        mode="outlined"
        style={{ marginBottom: 4 }}
      />
      <HelperText type="error" visible={showError}>
        Task title is required
      </HelperText>

      <Button mode="contained" onPress={addTask} style={{ marginBottom: 16 }}>
        Add Task
      </Button>

      <FlatList
        data={project.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
      />

      <Button mode="outlined" onPress={handleSaveAndGoBack} style={{ marginTop: 16 }}>
        Save Changes
      </Button>
    </SafeAreaView>
  );
}