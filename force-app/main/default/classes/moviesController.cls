public with sharing class moviesController {


    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getMovies(String movieName){

        List<Movie__c> moviesList = new List<Movie__c>();
        if(!String.isBlank(movieName)){
            String nm = '%' + movieName + '%';
            moviesList = [SELECT Id, Name, Description__c, Category__c, ReleaseDate__c, ContentDocumentId__c, Image__c
                                        FROM Movie__c WHERE Name like: nm];

        }else if(String.isBlank(movieName)){
            moviesList = [SELECT Id, Name, Description__c, Category__c, ReleaseDate__c, ContentDocumentId__c, Image__c
                                        FROM Movie__c];
        }

        return moviesList;
    }
    @AuraEnabled(Cacheable=false)
    public static void createMovie(NewMovie movie, List<String> actorsIds, String base64,String filename){

        Movie__c newMovieToinsert = new Movie__c();

        ContentVersion cv = createContentVersion(base64, filename);

        newMovieToinsert.Name = movie.name;
        newMovieToinsert.Category__c = movie.category;
        newMovieToinsert.Description__c = movie.description;
        newMovieToinsert.ReleaseDate__c = movie.releaseDate;
        newMovieToinsert.ContentDocumentId__c = '/sfc/servlet.shepherd/version/download/'+[SELECT Id FROM ContentVersion WHERE Id =: cv.Id].Id;

        insert newMovieToinsert;

        ContentDocumentLink cdl = createContentLink(cv.Id, newMovieToinsert.Id);
    
        List<MovieActor__c> movieActorsToinsert  = new List<MovieActor__c>();

        Map<Id, Actor__c> actors = new Map<Id,Actor__c>([SELECT Id, Name FROM Actor__c WHERE Id IN: actorsIds]);

        for(String actorId : actorsIds){

            MovieActor__c movieActor = new MovieActor__c();

            movieActor.name = newMovieToinsert.Name + '_' + actors.get(actorId).Name;
            movieActor.Actor__c = actorId;
            movieActor.Movie__c = newMovieToinsert.Id;
            movieActorsToinsert.add(movieActor);
        }

        insert movieActorsToinsert;
    }

    public static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        System.debug('cv:: '+cv);
        try {
            insert cv;
            return cv;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }

    public static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
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