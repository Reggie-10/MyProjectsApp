import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { loadData, saveData } from '../utils/storage';
import TaskItem from '../components/TaskItem';

export default function ProjectDetailScreen() {
  const { projectId } = useRoute().params;

  const [project, setProject] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');

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
    if (!taskTitle.trim()) return;

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
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Enter task title"
        value={taskTitle}
        onChangeText={setTaskTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={project.tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={() => toggleTask(item.id)} />
        )}
      />
    </View>
  );
}
