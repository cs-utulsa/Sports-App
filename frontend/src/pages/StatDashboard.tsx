import {
    Pressable,
    StyleSheet,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StatsNavigationProp } from '@navigation/types';
import axios from 'axios';
import { DEVELOPMENT_API } from '../constants/urls';
import { StatLeaderboard } from '@molecules/StatLeaderboard';
import { ErrorBox } from '@atoms/ErrorBox';

export const StatDashboard = () => {
    const { authData } = useAuth();
    const { push } = useNavigation<StatsNavigationProp>();
    const [statData, setStatData] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState<boolean>(false);

    const getStatData = useCallback(async (stat_id: string) => {
        try {
            const response = await axios.get(
                `${DEVELOPMENT_API}/leaderboard/${stat_id}`
            );
            return response.data;
        } catch (err) {
            return {
                error: true,
                _id: stat_id,
            };
        }
    }, []);

    const getAllStats = useCallback(
        async (stats: string[]) => {
            const _statData: any = [];
            for (let stat of stats) {
                let data = await getStatData(stat);
                _statData.push(data);
            }
            return _statData;
        },
        [getStatData]
    );

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (authData?.stats) {
                    setLoadingStats(true);
                    const _statData = await getAllStats(authData.stats);
                    setStatData(_statData);
                    setLoadingStats(false);
                }
            })();
        }, [authData, getAllStats])
    );

    return (
        <ScrollView contentContainerStyle={styles.pageContainer}>
            <Pressable
                style={styles.followBtn}
                onPress={() => push('Selection')}
            >
                <Text style={styles.followBtnText}>Follow More Stats</Text>
            </Pressable>

            {statData.map((stat) => {
                if (stat?.error) {
                    return <ErrorBox error={`${stat._id} cannot be found.`} />;
                }

                return (
                    <StatLeaderboard
                        key={stat._id}
                        _id={stat._id}
                        player_id={stat.player_names}
                        value={stat.value}
                        name={stat.name}
                    />
                );
            })}
            {loadingStats && <ActivityIndicator color="black" size="large" />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalHeader: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        color: '#EE6730',
        marginTop: 20,
    },
    followBtn: {
        width: '90%',
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    followBtnText: {
        textAlign: 'center',
        color: '#EE6730',
        fontSize: 16,
    },
    pageContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
});

// export const StatDashboard = () => {
// const [ leaderboard, setLeaderboard] = useState<LeaderboardProps>();
// useEffect(() => {
//     axios
//         .get<LeaderboardProps>(`${LOCAL_API}/leaderboard/pts`)
//         .then((response) => {
//             setLeaderboard(response.data);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }, []);

// const [apiData, setAPIData] = useState<string>();
// useEffect(() => {
//     axios
//         .get<string>(`${LOCAL_API}/test`)
//         .then((response) => {
//             setAPIData(response.data);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }, []);

// return (
//     <Text>Something</Text>
//<Text>Test test : {apiData}</Text>
// <View style={styles.container}>
//     <StatLeaderboard
//         _id={leaderboard?._id!}
//         player_id={leaderboard?.player_id!}
//         value={leaderboard?.value!}
//     />
//     <FlatList
//         data={DATA}
//         renderItem={({ item, index }) => (
//             <StatLeaderboard
//                 name={item.title}
//                 data={item.data}
//                 key={`leaderboard-${index}`}
//             />
//         )}
//         numColumns={1}
//         ItemSeparatorComponent={Seperator}
//     />
// </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         marginTop: 10,
//         flex: 1,
//     },
// });
