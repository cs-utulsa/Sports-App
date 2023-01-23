import axios from 'axios';
import { DEVELOPMENT_API } from '../../constants/urls';
import { useQuery } from '@tanstack/react-query';
import { PerModeId, Stat } from '../../types/Stat';
import { STATS } from '@constants/stats';

export const useStats = (stats: string[] | undefined, mode: PerModeId) => {
    return useQuery<Stat[]>({
        queryKey: ['stats'],
        queryFn: async () => {
            if (!stats) return [];

            const _statsData = [];
            for (let stat of stats) {
                const { data } = await axios.get(
                    `${DEVELOPMENT_API}/leaderboard/${stat}/${mode}`
                );
                // get stat name
                const name = STATS.find((item) => stat === item.id)?.name;
                _statsData.push({ ...data, name });
            }

            return _statsData;
        },
    });
};