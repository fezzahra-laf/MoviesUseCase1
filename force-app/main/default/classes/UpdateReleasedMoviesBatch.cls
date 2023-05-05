public with sharing class UpdateReleasedMoviesBatch implements Database.Batchable<sObject>{
    public Database.QueryLocator start(Database.BatchableContext BC)
    {
        String query = 'SELECT Id,IsReleased__c,ReleaseDate__c '+
                       'FROM Movie__c '+
                       'WHERE ReleaseDate__c <= TODAY '+
                       'AND isReleased__c != true';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext BC, List<Movie__c> movies)
    {
        List<Movie__c> moviesToUpdate = new List<Movie__c>();
        for(Movie__c movie : movies)
        {
            movie.isReleased__c = true;
            moviesToUpdate.add(movie);
        }
        update moviesToUpdate;
    }
   
    public void finish(Database.BatchableContext BC) {
         
    }
}