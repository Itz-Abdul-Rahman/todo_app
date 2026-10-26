import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context/lib/typescript/src/SafeAreaView";
type User = {
    id: number;
    name: string;
    email: string;
};


function fetchUser() {

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/users',
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data: User[] = await response.json();
                setUsers(data);
            } catch {
                setError('Unable to load users. Try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: "white" }]}>
                <ActivityIndicator size="large" />
                <Text>Loading users...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Users</Text>

            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.email}>{item.email}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
    },
    email: {
        color: '#64748B',
        marginTop: 5,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#172033',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        paddingHorizontal: 20,
    },
})

export default fetchUser;