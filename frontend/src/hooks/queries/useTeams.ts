import { ICONS } from '@constants/icons';
import { DEVELOPMENT_API } from '@constants/urls';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Team } from './../../types/Team';

export const useTeams = (teams: string[]) => {
    return useQuery<Team[]>({
        queryKey: ['userTeams'],
        queryFn: async () => {
            if (!teams) return [];

            const _teamData: Team[] = [];
            for (let team of teams) {
                const data: Team = await axios
                    .get(`${DEVELOPMENT_API}/team/${team}`)
                    .then((res) => res.data);

                const icon = ICONS.find(
                    (item) => item.code === data.abbr
                )?.logo;

                _teamData.push({ ...data, icon });
            }

            return _teamData;
        },
    });
};
