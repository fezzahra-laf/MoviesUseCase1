public with sharing class UpdateReleasedMoviesScheduler implements Schedulable {

    public void execute(SchedulableContext SC) {
        UpdateReleasedMoviesBatch b = new UpdateReleasedMoviesBatch(); 
        Database.executeBatch(b);
    }

 }
