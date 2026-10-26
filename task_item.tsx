import { View, Text, StyleSheet } from 'react-native';

type TaskItemProps = {
    id: string,
    title: string;
    completed: boolean;
    dueDate?: Date
};

function TaskItem({ title, completed, dueDate }: TaskItemProps) {
    return (
        <View style={[styles.card, {}]}>
            <Text style={[styles.title, { color: completed ? 'green' : 'black' }]}>{title}</Text>

            {dueDate != null && <Text>
                {dueDate.toDateString()}
            </Text>}

            <Text>
                {completed ? 'Completed' : 'Pending'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 10,
        borderRadius: 12,

    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: "black"
    },
});

export default TaskItem;