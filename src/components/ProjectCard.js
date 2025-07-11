import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';

export default function ProjectCard({ project, onPress, onDelete }) {
  const completed = project.tasks?.filter(t => t.completed).length || 0;
  const total = project.tasks?.length || 0;
  const status = completed === total && total > 0 ? 'Completed' : 'In Progress';

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <View style={{ flex: 1 }} onTouchEnd={onPress}>
          <Title>{project.title}</Title>
          <Paragraph>{`${completed} of ${total} done`}</Paragraph>
          <Paragraph style={{ color: status === 'Completed' ? 'green' : 'orange' }}>
            Status: {status}
          </Paragraph>
        </View>
        <IconButton icon="delete" onPress={onDelete} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
