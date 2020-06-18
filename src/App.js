import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    View,
    FlatList,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        handleGetRepositories();
    }, []);

    function handleGetRepositories() {
        api.get('repositories')
        .then((response) => {
            setRepositories(response.data);
        })
        .catch((error) => console.log(error));

    }

    async function handleLikeRepository(id) {
        const filteredRepositories = repositories.filter(repository => repository.id !== id);

        await api.post(`repositories/${id}/like`)
        .then(response => {
            const { likes } = response.data;
            let repository = repositories.find(repo => repo.id === id);
            repository = {
                ...repository,
                likes
            };
            setRepositories([...filteredRepositories, repositories[repository] = repository]);
        })
        .catch((error) => console.log(error));

    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="rgba(151,139,193,0.76)"/>
            <SafeAreaView style={styles.container}>
                <FlatList style={styles.repositoryContainer}
                    data={repositories}
                    keyExtractor={repository => repository.id}
                    renderItem={({ item: repository }) => (
                        <View>
                            <Text style={styles.repository}>
                                {repository.title}
                            </Text>
                            <View style={styles.techsContainer}>
                                {repository.techs.map(tech => <Text key={tech}>{tech}</Text>)}
                            </View>

                            <View style={styles.likesContainer}>
                                <Text
                                    style={styles.likeText}
                                    testID={`repository-likes-${repository.id}`}
                                >{repository.likes} curtida{repository.likes > 0 && 's'}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleLikeRepository(repository.id)}
                                testID={`like-button-${repository.id}`}
                            >
                                <Text style={styles.buttonText}>Curtir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7159c1",
    },
    repositoryContainer: {
        marginBottom: 15,
        marginTop: 15,
        marginHorizontal: 15,
        backgroundColor: "#fff",
        padding: 20,
    },
    repository: {
        fontSize: 32,
        fontWeight: "bold",
    },
    techsContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    tech: {
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 10,
        backgroundColor: "#04d361",
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: "#fff",
    },
    likesContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    likeText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
    },
    button: {
        marginTop: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
        color: "#fff",
        backgroundColor: "#7159c1",
        padding: 15,
    },
});
