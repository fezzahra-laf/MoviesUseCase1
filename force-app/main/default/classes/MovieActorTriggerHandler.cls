public with sharing class MovieActorTriggerHandler {

    public void AdjustMovieNumberAndGenderPercentage(List<MovieActor__c> movieActorList){

        String FEMALE_GENDER = 'Female';
        String MALE_GENDER   = 'Male';

        List<Movie__c> moviesToUpdate = new List<Movie__c>();
        List<String> actorsIds = new List<String>();
        List<String> moviesIds = new List<String>();

        for(MovieActor__c ma : movieActorList){
            actorsIds.add(ma.Actor__c);
            moviesIds.add(ma.Movie__c);
        }

        Map<Id, Actor__c> actorsMap = new Map<Id, Actor__c>([SELECT Id, NumberOfMovies__c, Gender__c 
                                                                FROM Actor__c 
                                                                WHERE Id IN: actorsIds]);

        for(Actor__c actor : actorsMap.values()){
            actor.NumberOfMovies__c += 1;
        }
        update actorsMap.values();

        List<MovieActor__c> allMovies = [SELECT Id, Actor__c, Movie__c
                                            FROM MovieActor__c 
                                            WHERE Movie__c IN: moviesIds
                                            ];

        Map<Id, List<Integer>> numberActorsPerMovie = new Map<Id, List<Integer>>();

        for(MovieActor__c m : allMovies){

            if(numberActorsPerMovie.containsKey(m.Movie__c)){
                numberActorsPerMovie.get(m.Movie__c)[0] = numberActorsPerMovie.get(m.Movie__c)[0]+1;
            } 
            else{
                numberActorsPerMovie.put(m.Movie__c, new List<Integer>{1,0,0});            
            }

            if(actorsMap.get(m.Actor__c).Gender__c == FEMALE_GENDER){
                numberActorsPerMovie.get(m.Movie__c)[1] = numberActorsPerMovie.get(m.Movie__c)[1]+1;
            }
            else if(actorsMap.get(m.Actor__c).Gender__c == MALE_GENDER){
                numberActorsPerMovie.get(m.Movie__c)[2] = numberActorsPerMovie.get(m.Movie__c)[2]+1;
            }

        }

        for(Id movieId : numberActorsPerMovie.keySet()){

            Movie__c movieToUpdate = new Movie__c();
            movieToUpdate.Id = movieId;
            movieToUpdate.FemaleActorsPercentage__c = (numberActorsPerMovie.get(movieId)[1] * 100)/numberActorsPerMovie.get(movieId)[0];
            movieToUpdate.MaleActorsPercentage__c   = (numberActorsPerMovie.get(movieId)[2] * 100)/numberActorsPerMovie.get(movieId)[0];
            moviesToUpdate.add(movieToUpdate);

        }

        update moviesToUpdate;
        
    }

}