package com.LOTR;

import java.util.List;
import java.util.Optional;

public interface TeamService {
    Team createTeam(Team team);
    List<Team> getAllTeams();
    Optional<Team> getTeamById(int id);
    Team updateTeam(int id, Team team);
    void deleteTeam(int id);
}
