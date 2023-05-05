trigger MovieActorTrigger on MovieActor__c (after insert) {

    MovieActorTriggerHandler handler = new MovieActorTriggerHandler();
    handler.AdjustMovieNumberAndGenderPercentage(Trigger.New);

}