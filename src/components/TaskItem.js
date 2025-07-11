import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Checkbox, IconButton } from 'react-native-paper';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <List.Item
      title={task.title}
      onPress={onToggle}
      titleStyle={task.completed ? styles.completed : null}
      left={() => (
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={onToggle}
          />
        </View>
      )}
      right={() => (
        <IconButton icon="delete" onPress={onDelete} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  completed: {
    color: 'gray',
  },
  checkboxContainer: {
    justifyContent: 'center',
  },
});
