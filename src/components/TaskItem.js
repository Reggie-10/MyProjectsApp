import React from 'react';
import { StyleSheet } from 'react-native';
import { List, Checkbox } from 'react-native-paper';

export default function TaskItem({ task, onToggle }) {
  return (
    <List.Item
      title={task.title}
      onPress={onToggle}
      titleStyle={task.completed ? styles.completed : null}
      left={() => (
        <Checkbox
          status={task.completed ? 'checked' : 'unchecked'}
          onPress={onToggle}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  completed: {
    color: 'gray',
  },
});
