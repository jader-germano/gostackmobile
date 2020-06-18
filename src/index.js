import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import api from './services/api'

export default function App() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        api.get('repositories')
        .then(response => {
            console.log(response.data);
            setRepositories(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    async function handleAddRepository() {
        const response = await api.post('repositories', {
            title: `Now  ${Date.now()}`,
            url: "https://github.com/jader-germano/study-nodejs",
            techs: ["React.js", "React"]
        });
        const repository = response.data;
        setRepositories([...repositories, repository])
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1"/>

            <SafeAreaView>
                <FlatList
                    syle={styles.container}
                    data={repositories}
                    keyExtractor={repository => repository.id}
                    renderItem={({ item: repository }) => (
                        <Text
                            style={styles.repository}
                            key={repository.id}>
                            {repository.title}
                        </Text>
                    )}
                />

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.button}
                    onPress={handleAddRepository}>
                    <Text>Adicionar Repositório</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7159c1",
    },

    repository: {
        color: 'grey',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#7159c1',
        margin: 20,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16
    }
})