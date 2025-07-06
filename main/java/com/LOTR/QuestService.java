package com.LOTR;

import java.util.List;
import java.util.Optional;

public interface QuestService {
    Quest createQuest(Quest quest);
    List<Quest> getAllQuests();
    Optional<Quest> getQuestById(int id);
    Quest updateQuest(int id, Quest quest);
    void deleteQuest(int id);
}
