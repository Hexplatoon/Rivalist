package com.example.typing.service;

import com.github.javafaker.Faker;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class TypingResultService {

    private final Faker faker = new Faker();
    private final Random random = new Random();

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
