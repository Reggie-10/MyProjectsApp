import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, HelperText, Title } from 'react-native-paper';

import { loadData, saveData } from '../utils/storage';
import TaskItem from '../components/TaskItem';

export default function ProjectDetailScreen() {
  const { projectId } = useRoute().params;

  const [project, setProject] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const allProjects = await loadData('projects');
      const selected = allProjects.find(p => p.id === projectId);
      setProject(selected);
    };
    fetchProject();
  }, []);

  const saveProject = async (updatedProject) => {
    const allProjects = await loadData('projects');
    const updatedList = allProjects.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );
    await saveData('projects', updatedList);
    setProject(updatedProject);
  };

  const addTask = () => {
    if (!taskTitle.trim()) {
      setShowError(true);
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      completed: false,
    };

    const updated = {
      ...project,
      tasks: [...project.tasks, newTask],
    };

    saveProject(updated);
    setTaskTitle('');
    setShowError(false);
  };

  const toggleTask = (taskId) => {
    const updated = {
      ...project,
      tasks: project.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    };

    saveProject(updated);
  };

  if (!project) return null;

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Title style={{ marginBottom: 16 , textAlign:'center'}}>{project.title}</Title>
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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={() => toggleTask(item.id)} />
        )}
      />
    </SafeAreaView>
  );
}
