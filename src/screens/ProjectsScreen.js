import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProjectCard from '../components/ProjectCard';
import { loadData, saveData } from '../utils/storage';

export default function ProjectsScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [showError, setShowError] = useState(false);

  // Load projects from storage
  useEffect(() => {
    const fetchProjects = async () => {
      const stored = await loadData('projects');
      if (stored) setProjects(stored);
    };

    if (isFocused) {
      fetchProjects();
    }
  }, [isFocused]);

  // Save updated projects to storage whenever changed
  const updateProjects = (newProjects) => {
    setProjects(newProjects);
    saveData('projects', newProjects);
  };

  // Add new project with duplicate check
  const addProject = useCallback(() => {
    const trimmedTitle = projectTitle.trim();
    if (!trimmedTitle) {
      setShowError(true);
      return;
    }

    const alreadyExists = projects.some(
      (p) => p.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (alreadyExists) {
      Alert.alert('Duplicate Project', 'A project with this title already exists.');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      title: trimmedTitle,
      tasks: [],
    };

    updateProjects([...projects, newProject].sort((a, b) => b.id - a.id));
    setProjectTitle('');
    setShowError(false);
  }, [projectTitle, projects]);

  // Delete project with confirmation
  const deleteProject = useCallback((projectId) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = projects.filter(p => p.id !== projectId);
            updateProjects(updated);
          },
        },
      ]
    );
  }, [projects]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Project Title"
        value={projectTitle}
        mode="outlined"
        onChangeText={(text) => {
          setProjectTitle(text);
          if (showError) setShowError(false);
        }}
        error={showError}
        style={{ marginBottom: 4 }}
      />
      <HelperText type="error" visible={showError}>
        Title is required
      </HelperText>

      <Button mode="contained" onPress={addProject} style={{ marginBottom: 16 }}>
        Add Project
      </Button>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
            onDelete={() => deleteProject(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}
