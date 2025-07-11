import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function ProjectCard({ project, onPress }) {
  const completed = project.tasks?.filter(t => t.completed).length || 0;
  const total = project.tasks?.length || 0;
  const status = completed === total && total > 0 ? 'Completed' : 'In Progress';

  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Content>
        <Title>{project.title}</Title>
        <Paragraph>{`${completed} of ${total} done`}</Paragraph>
        <Paragraph style={{ color: status === 'Completed' ? 'green' : 'orange' }}>
          Status: {status}
        </Paragraph>
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
});
