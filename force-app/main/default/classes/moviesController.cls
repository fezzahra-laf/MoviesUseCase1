public with sharing class moviesController {


    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getMovies(String movieName){

        List<Movie__c> moviesList = new List<Movie__c>();
        if(!String.isBlank(movieName)){
            String nm = '%' + movieName + '%';
            moviesList = [SELECT Id, Name, Description__c, Category__c, ReleaseDate__c, Image__c
                                        FROM Movie__c WHERE Name like: nm];

        }else if(String.isBlank(movieName)){
            moviesList = [SELECT Id, Name, Description__c, Category__c, ReleaseDate__c, Image__c
                                        FROM Movie__c];
        }

        return moviesList;
    }

    @AuraEnabled(cacheable=true)
    public static void createMovie(NewMovie movie, List<String> actors){

        Movie__c newMovieToinsert = new Movie__c();

        newMovieToinsert.Name = movie.name;
        newMovieToinsert.Category__c = movie.category;
        newMovieToinsert.Description__c = movie.description;
        newMovieToinsert.ReleaseDate__c = movie.releaseDate;
    
        System.debug('newMovieToinsert 1' + newMovieToinsert);
        insert newMovieToinsert;
        System.debug('newMovieToinsert 2' + newMovieToinsert);

    
        List<MovieActor__c> movieActorsToinsert  = new List<MovieActor__c>();

        for(String actorId : actors){

            MovieActor__c movieActor = new MovieActor__c();

            movieActor.Actor__c = actorId;
            movieActor.Movie__c = newMovieToinsert.Id;
            movieActorsToinsert.add(movieActor);
        }

        System.debug('newMovieToinsert 3' + movieActorsToinsert);


        insert movieActorsToinsert;
    }

    public class NewMovie{

        @AuraEnabled
        public String name {get; set;}

        @AuraEnabled
        public String description {get; set;}

        @AuraEnabled
        public String category {get; set;}

        @AuraEnabled
        public Date releaseDate {get; set;}

      
    }

}