package com.LOTR;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // Added for base path
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/heroes") 
public class HeroController {

	private final HeroService heroService;

	public HeroController(HeroService heroService) {
		this.heroService = heroService;
	}

	@PostMapping
	public ResponseEntity<Hero> createHero(@RequestBody Hero hero) {
		Hero savedHero = heroService.createHero(hero);
		return new ResponseEntity<>(savedHero, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<Hero>> getAllHeroes() {
		List<Hero> heroes = heroService.getAllHeroes();
		return new ResponseEntity<>(heroes, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Hero> getHeroById(@PathVariable int id) {
		return heroService.getHeroById(id)
				.map(hero -> new ResponseEntity<>(hero, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Hero> updateHero(@PathVariable int id, @RequestBody Hero hero) {
		try {
			Hero updatedHero = heroService.updateHero(id, hero);
			return new ResponseEntity<>(updatedHero, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
		//shows an error if you try to delete a non existent hero id
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteHero(@PathVariable int id) {
		try {
			heroService.deleteHero(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		}
	}

	

	// Assign a Hero to a Team
	@PutMapping("/{heroId}/assignTeam/{teamId}")
	public ResponseEntity<Hero> assignHeroToTeam(@PathVariable int heroId, @PathVariable int teamId) {
		try {
			Hero updatedHero = heroService.assignHeroToTeam(heroId, teamId);
			return new ResponseEntity<>(updatedHero, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		}
	}

	// Assign a Hero to a Quest
	@PutMapping("/{heroId}/assignQuest/{questId}")
	public ResponseEntity<Hero> assignHeroToQuest(@PathVariable int heroId, @PathVariable int questId) {
		try {
			Hero updatedHero = heroService.assignHeroToQuest(heroId, questId);
			return new ResponseEntity<>(updatedHero, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// Remove a Hero from a Quest
	@PutMapping("/{heroId}/removeQuest/{questId}")
	public ResponseEntity<Hero> removeHeroFromQuest(@PathVariable int heroId, @PathVariable int questId) {
		try {
			Hero updatedHero = heroService.removeHeroFromQuest(heroId, questId);
			return new ResponseEntity<>(updatedHero, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
