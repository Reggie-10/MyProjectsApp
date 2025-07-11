import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
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

  useEffect(() => {
    const fetchProjects = async () => {
      const stored = await loadData('projects');
      if (stored) setProjects(stored);
    };

    if (isFocused) {
      fetchProjects();
    }
  }, [isFocused]);

  useEffect(() => {
    saveData('projects', projects);
  }, [projects]);

  const addProject = () => {
    if (!projectTitle.trim()) {
      setShowError(true);
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      tasks: [],
    };

    setProjects(prev => [...prev, newProject]);
    setProjectTitle('');
    setShowError(false);
  };

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
          />
        )}
      />
    </SafeAreaView>
  );
}
