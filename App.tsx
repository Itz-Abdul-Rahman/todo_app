
import React, { useState, useEffect } from 'react';
import TaskItem from './task_item';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  // SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Keyboard,
  Button,
  ActivityIndicator,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date,
};



function App() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');

  const [fetchCount, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        setError('');

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos?_limit=${fetchCount}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const json: unknown = await response.json();

        if (!Array.isArray(json)) {
          throw new Error('Invalid API response');
        }

        const apiTasks: Task[] = json.map(item => ({
          id: String(item.id),
          title: String(item.title),
          completed: Boolean(item.completed),
        }));

        setTasks(apiTasks);

      } catch (error) {
        setError('Tasks load aagala. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [fetchCount])


  const validateName = (name: string): string => {
    if (!name.trim()) {
      return 'Name is required';
    }

    return '';
  };


  // const addTask = () => {
  //   const title = taskInput.trim();

  //   if (title.length === 0) {
  //     return;
  //   }

  //   const newTask: Task = {
  //     id: Date.now().toString(),
  //     title: title,
  //     completed: false,
  //     dueDate: selectedDate!
  //   };

  //   setTasks(previousTasks => [...previousTasks, newTask]);
  //   setTaskInput('');
  //   Keyboard.dismiss();
  // };


  const addTask = () => {
    const title = taskInput.trim();

    let isValid = true;

    if (!title) {
      setNameError('Task name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!selectedDate) {
      setDateError('Please select date and time');
      isValid = false;
    } else if (selectedDate.getTime() <= Date.now()) {
      setDateError('Please select a future date and time');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!isValid || !selectedDate) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      dueDate: selectedDate,
    };

    setTasks(previousTasks => [...previousTasks, newTask]);
    setTaskInput('');
    setSelectedDate(null);
  };

  const toggleTask = (id: string) => {
    setTasks(previousTasks =>
      previousTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(previousTasks =>
      previousTasks.filter(task => task.id !== id),
    );
  };


  const openDateTimePicker = () => {
    const now = new Date();

    DateTimePickerAndroid.open({
      value: selectedDate ?? now,
      mode: 'date',
      minimumDate: now,

      onChange: (event, pickedDate) => {
        if (event.type !== 'set' || !pickedDate) {
          return;
        }

        const chosenDate = new Date(pickedDate);

        DateTimePickerAndroid.open({

          value: selectedDate ?? chosenDate,
          mode: 'time',
          is24Hour: true,

          onChange: (timeEvent, pickedTime) => {
            if (timeEvent.type !== 'set' || !pickedTime) {
              return;
            }

            const finalDate = new Date(chosenDate);

            finalDate.setHours(
              pickedTime.getHours(),
              pickedTime.getMinutes(),
              0,
              0,
            );

            setSelectedDate(finalDate);
            setDateError('');
          },
        });
      },
    });
  };




  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Tasks</Text>
        <Text style={styles.subtitle}>
          Organize your day
        </Text>
      </View>






      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          placeholderTextColor="#888"
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />

        <Pressable
          style={styles.addButton}
          onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* <Pressable
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {selectedDate
            ? selectedDate.toLocaleString()
            : 'Select date and time'}
        </Text>
      </Pressable> */}

      {dateError ? (
        <Text style={styles.errorText}>{dateError}</Text>
      ) : null}

      {nameError ? (
        <Text style={styles.errorText}>{nameError}</Text>
      ) : null}


      <Pressable
        style={styles.dateButton}
        onPress={openDateTimePicker}>
        <Text>
          {selectedDate
            ? selectedDate.toLocaleString()
            : 'Select date and time'}
        </Text>
      </Pressable>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Your tasks</Text>
        <Text style={styles.taskCount}>
          {tasks.length} tasks
        </Text>
      </View>



      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Add your first task!
          </Text>
        }


        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Pressable
              style={[
                styles.checkButton,
                item.completed && styles.checkedButton,
              ]}
              onPress={() => toggleTask(item.id)}>
              <Text style={styles.checkText}>
                {item.completed ? '✓' : ''}
              </Text>
            </Pressable>

            <Pressable
              style={styles.taskContent}
              onPress={() => toggleTask(item.id)}>
              <TaskItem
                id=''
                title={item.title}
                completed={item.completed}
                dueDate={item.dueDate}
              />
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />


      {loading && <ActivityIndicator size="large" />}

      <Pressable style={{ backgroundColor: "grey", padding: 10, alignItems: "center", margin: 10 ,borderRadius: 12,}} onPress={
        () => {

          setCount(fetchCount + 10);
        }
      }>
        <Text style={{ color: "black", alignContent: "center", }}>
          Load More
        </Text>
      </Pressable>

      <View style={styles.foter}>
        <Text style={styles.footerText}>
          Completed: {tasks.filter(task => task.completed).length}
          {' / '}
          {tasks.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({




  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#172033',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  dateButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E1E5ED',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E5ED',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#172033',
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172033',
  },
  taskCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 45,
    fontSize: 15,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  checkButton: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedButton: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#172033',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  foter: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E1E5ED',
  },
  footerText: {
    textAlign: 'center',
    color: '#6B7280',
  },
});


type ButtonProbs = {
  count: number
  onIncrease: () => void;
  ondecrease: () => void;
  onreset: () => void;
}


function Counter({
  count,
  onIncrease,
  ondecrease,
  onreset
}: ButtonProbs) {
  return (<View>
    <Text style={{ fontSize: 30, textAlign: 'center' }}>
      Count: {count}
    </Text>

    <Button title="Increase" onPress={onIncrease} />
    <Button title="Decrease" onPress={ondecrease} />
    <Button title="Reset" onPress={onreset} />
  </View>)
}

export default App;
