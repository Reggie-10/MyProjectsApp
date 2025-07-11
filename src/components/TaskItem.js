import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function TaskItem({ task, onToggle }) {
  return (
    <TouchableOpacity onPress={onToggle} style={{ flexDirection: 'row', padding: 8 }}>
      <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </Text>
    </TouchableOpacity>
  );
}