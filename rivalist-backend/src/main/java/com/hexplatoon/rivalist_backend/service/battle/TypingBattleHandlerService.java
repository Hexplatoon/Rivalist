package com.hexplatoon.rivalist_backend.service.battle;

import com.github.javafaker.Faker;
import com.hexplatoon.rivalist_backend.dto.battle.Result;
import com.hexplatoon.rivalist_backend.dto.battle.config.Config;
import com.hexplatoon.rivalist_backend.dto.battle.config.TypingConfig;
import com.hexplatoon.rivalist_backend.entity.Battle;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TypingBattleHandlerService {

    private final Map<Long, Config> configMap = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, String>> userTextMap = new ConcurrentHashMap<>();
    private final BattleService battleService;
    private final Faker faker = new Faker();
    private final Random random = new Random();

    TypingBattleHandlerService(@Lazy BattleService battleService){
        this.battleService = battleService;
    }

    public Config getConfig(Long battleId) {

        String text = getRandomText(20);
        Integer duration = battleService.getActiveBattleById(battleId).getDuration();

        Config config = TypingConfig.builder()
                .text(text)
                .duration(duration)
                .build();

        configMap.put(battleId, config);
        return config;
    }

    public void saveUserText(Long battleId, String username, String text) {
        userTextMap.putIfAbsent(battleId, new ConcurrentHashMap<>());
        userTextMap.get(battleId).put(username, text);
    }

    public Result getResult(Long battleId) {
        System.out.println("getResult");
        // TODO : Faulty result calculation. No accuracy check
        // TODO : require error checks
        Battle battle = battleService.findBattleById(battleId);
        Config config = configMap.remove(battle.getId());

        String challengerUsername = battle.getChallenger().getUsername();
        String opponentUsername = battle.getOpponent().getUsername();
        Map<String, String> textMap = userTextMap.remove(battleId);
        String challengerText = textMap.get(challengerUsername);
        String opponentText = textMap.get(opponentUsername);
        String originalText = ((TypingConfig)config).getText();
        Integer durationInSeconds = ((TypingConfig)config).getDuration();

        System.out.println("challengerText : " + challengerText);
        System.out.println("opponentText : " + opponentText);
        System.out.println("original text : " + originalText);
        System.out.println("durationInSeconds : " + durationInSeconds);
        System.out.println("challengerUsername : " + challengerUsername);
        System.out.println("opponentUsername : " + opponentUsername);

        List<Double> challengerStats = calculateStats(challengerText, originalText, durationInSeconds);
        List<Double> opponentStats = calculateStats(opponentText, originalText, durationInSeconds);
        double challengerWPM = challengerStats.get(0);
        double opponentWPM = opponentStats.get(0);
        System.out.println("challengerWPM : " + challengerWPM);
        System.out.println("opponentWPM : " + opponentWPM);
        String winnerUsername, loserUsername;
        double winnerScore, loserScore;

        if (challengerWPM >= opponentWPM) {
            winnerUsername = challengerUsername;
            loserUsername = opponentUsername;
            winnerScore = challengerWPM;
            loserScore = opponentWPM;
        } else {
            winnerUsername = opponentUsername;
            loserUsername = challengerUsername;
            winnerScore = opponentWPM;
            loserScore = challengerWPM;
        }

        return Result.builder()
                .winnerUsername(winnerUsername)
                .loserUsername(loserUsername)
                .winnerScore(winnerScore)
                .loserScore(loserScore)
                .build();
    }

    private double calculateWPM(String typedText, int durationInSeconds) {
        String[] words = typedText.trim().split("\\s+");
        return (words.length / (durationInSeconds / 60.0));
    }

    public static List<Double> calculateStats(String typedText, String originalText, int durationInSeconds) {
        String[] typedWords = typedText.trim().split("\\s+");
        String[] originalWords = originalText.trim().split("\\s+");

        int correctWords = 0;
        int totalWords = Math.min(typedWords.length, originalWords.length);

        for (int i = 0; i < totalWords; i++) {
            if (typedWords[i].equals(originalWords[i])) {
                correctWords++;
            }
        }

        // WPM calculation
        double minutes = durationInSeconds / 60.0;
        double wpm = typedWords.length / minutes;

        // Accuracy calculation
        double accuracy = (typedWords.length == 0) ? 0 : (100.0 * correctWords / typedWords.length);

        return Arrays.asList(wpm, accuracy);
    }


    public String getRandomText(int sentenceCount){
        List<String> output = new ArrayList<>();

        for (int i = 0; i < sentenceCount; i++) {
            String sentence;
            switch (random.nextInt(15)) {
                case 0 -> sentence = faker.hitchhikersGuideToTheGalaxy().quote();
                case 1 -> sentence = faker.book().title() + " by " + faker.book().author();
                case 2 -> sentence = faker.company().catchPhrase();
                case 3 -> sentence = faker.shakespeare().kingRichardIIIQuote();
                case 4 -> sentence = faker.shakespeare().asYouLikeItQuote();
                case 5 -> sentence = faker.shakespeare().hamletQuote();
                case 6 -> sentence = faker.shakespeare().romeoAndJulietQuote();
                case 7 -> sentence = faker.yoda().quote();
                case 8 -> sentence = faker.chuckNorris().fact();
                case 9 -> sentence = faker.friends().quote();
                case 10 -> sentence = faker.gameOfThrones().quote();
                case 11 -> sentence = faker.harryPotter().quote();
                case 12 -> sentence = faker.lordOfTheRings().character();
                case 13 -> sentence = faker.artist().name() + " plays " + faker.music().instrument();
                case 14 -> sentence = faker.superhero().name() + " can " + faker.superhero().power();
                default -> sentence = faker.educator().course();
            }
            sentence = sentence.replaceAll("[.,!?':\"’;+π/0123456789%=–…‘—#()-]", "");
            output.add(sentence.toLowerCase());
        }

        return String.join(" ", output);
    }
}
