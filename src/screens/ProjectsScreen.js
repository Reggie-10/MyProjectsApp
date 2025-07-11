import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ProjectCard from '../components/ProjectCard';
import { loadData, saveData } from '../utils/storage';

export default function ProjectsScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');

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
    if (!projectTitle.trim()) return;

    const newProject = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      tasks: [],
    };

    setProjects(prev => [...prev, newProject]);
    setProjectTitle('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Enter project title"
        value={projectTitle}
        onChangeText={setProjectTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="Add Project" onPress={addProject} />
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
    </View>
  );
}
