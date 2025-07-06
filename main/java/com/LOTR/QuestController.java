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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quests") 
public class QuestController {

    private final QuestService questService; // Inject the service layer

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @PostMapping
    public ResponseEntity<Quest> createQuest(@RequestBody Quest quest) {
        Quest savedQuest = questService.createQuest(quest);
        return new ResponseEntity<>(savedQuest, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Quest>> getAllQuests() {
        List<Quest> quests = questService.getAllQuests();
        return new ResponseEntity<>(quests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quest> getQuestById(@PathVariable int id) {
        return questService.getQuestById(id)
                .map(quest -> new ResponseEntity<>(quest, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quest> updateQuest(@PathVariable int id, @RequestBody Quest quest) {
        try {
            Quest updatedQuest = questService.updateQuest(id, quest);
            return new ResponseEntity<>(updatedQuest, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(@PathVariable int id) {
        try {
            questService.deleteQuest(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
