package com.LOTR;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HeroController {
	@Autowired
	HeroRepository heroRepo;
	
	
	@PostMapping("/heros")
	public Hero createHero(@RequestBody Hero hero) {
		
		Hero savedHero = heroRepo.save(hero);
		return savedHero;
	}
	
	@GetMapping("/heros")
	public List<Hero> findAllHeros(){
		return heroRepo.findAll();
	}
	@PutMapping("/heros/{id}")
	public Hero updateHero (@PathVariable int id, @RequestBody Hero hero) {
		hero.setHeroID(id);
		return heroRepo.save(hero);
	}
	@DeleteMapping("/heros/{id}")
	public ResponseEntity<?> deleteHero(@PathVariable int id) {
	    heroRepo.deleteById(id);
	    return ResponseEntity.ok().build();
	
}
}
