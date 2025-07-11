import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function ProjectCard({ project, onPress }) {
  const completed = project.tasks?.filter(t => t.completed).length || 0;
  const total = project.tasks?.length || 0;
  const status = completed === total && total > 0 ? 'Completed' : 'In Progress';

  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 16, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{project.title}</Text>
      <Text>{`${completed} of ${total} done`}</Text>
      <Text>Status: {status}</Text>
    </TouchableOpacity>
  );
}