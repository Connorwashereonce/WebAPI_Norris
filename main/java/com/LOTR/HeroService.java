package com.LOTR;

import java.util.List;
import java.util.Optional;

public interface HeroService {
    Hero createHero(Hero hero);
    List<Hero> getAllHeroes();
    Optional<Hero> getHeroById(int id);
    Hero updateHero(int id, Hero hero);
    void deleteHero(int id);
    Hero assignHeroToTeam(int heroId, int teamId); // New method for relationship
    Hero assignHeroToQuest(int heroId, int questId); // New method for relationship
    Hero removeHeroFromQuest(int heroId, int questId); // New method for relationship
}
