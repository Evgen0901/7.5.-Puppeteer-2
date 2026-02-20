Feature: Search a course
    //Scenario: Should search by text
      //  Given user is on "/navigation" page
        //When user search by "инженер по тес"
        //Then user sees the course suggested "Инженер по тестированию"

Scenario: Should successfully book a ticket 1
        Given user is on "http://qamid.tmweb.ru/client/index.php" page
        When user click by button of date 1
        When user click by button of movie session time 1
        When user click to choose of free seat 1
        When user click by button to book a ticket
        Then user sees the title "Вы выбрали билеты:"

    Scenario: Should successfully book a ticket 2
        Given user is on "http://qamid.tmweb.ru/client/index.php" page
        When user click by button of date 2
        When user click by button of movie session time 2
        When user click to choose of free seat 2
        When user click by button to book a ticket
        Then user sees the title "Вы выбрали билеты:"

    Scenario: Should unsuccessfully book a ticket
        Given user is on "http://qamid.tmweb.ru/client/index.php" page
        When user click by button of date 3
        When user click by button of movie session time 3
        Then Button for booking has property disabled: "true"
        