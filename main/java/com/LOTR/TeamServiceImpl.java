package com.LOTR;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;

    public TeamServiceImpl(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Optional<Team> getTeamById(int id) {
        return teamRepository.findById(id);
    }

    @Override
    public Team updateTeam(int id, Team teamDetails) {
        return teamRepository.findById(id)
                .map(team -> {
                    team.setTeamName(teamDetails.getTeamName());
                    team.setMotto(teamDetails.getMotto());
                    return teamRepository.save(team);
                })
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + id));
    }

    @Override
    public void deleteTeam(int id) {
        teamRepository.deleteById(id);
    }
}
