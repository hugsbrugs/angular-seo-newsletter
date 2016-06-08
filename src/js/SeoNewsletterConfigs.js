'use strict';

/**
 *
 */
angular.module('hugsbrugs.angular-seo-newsletter-configs', [])

	.config(['$translateProvider', 
		function($translateProvider)
		{

			$translateProvider.translations('en', {
		        // Server side translation keys
		        "ERROR_SAVING_SUBSCRIPTION" : "Error while saving your mail.",
		        "EMAIL_ALREADY_SUBSCRIBER" : "Your email is already saved !",
		        "EMAIL_JUNK" : "You email is not trustable : please provide another one.",
		        "EMAIL_INVALID" : "Your email is onvalid, please double check it !",
		        "EMAIL_EMPTY" : "Your email is empty.",
		        "EMAIL_NOT_SET" : "Your email is missing.",
		        "INTERNAL_SERVER_ERROR" : "An internal error occured, please try again later.",
		        // Client side translation keys
		        "DEFAULT_HEADER_TEXT" : "I'm a title",
		        "DEFAULT_CALL_ACTION_TEXT" : "I'm a call to action",
		        "DEFAULT_SUB_TEXT" : "I'm a sub text",
		        "DEFAULT_EMAIL_PLACEHOLDER" : "I want your mail",
		        "DEFAULT_SUCCESS_TEXT" : "Thank you sweety",
		        "DEFAULT_ERROR_TEXT" : "Unknown error, if you have moment please report this error through our <a ng-href='https://hugo.maugey.fr/fr/contact'>contact form</a>. Sorry for that."
		 	});

			$translateProvider.translations('fr', {
		        // Server side translation keys
		        "ERROR_SAVING_SUBSCRIPTION" : "Erreur lors de l'enregistrement de votre email",
		        "EMAIL_ALREADY_SUBSCRIBER" : "Votre email est déjà enregitré !",
		        "EMAIL_JUNK" : "Votre email n'est pas digne de confiance, veuillez renseigner une autre adresse mail.",
		        "EMAIL_INVALID" : "Votre email est invalide, veuillez vérifier que vous n'avez pas fait d'erreur.",
		        "EMAIL_EMPTY" : "Votre email est vide !",
		        "EMAIL_NOT_SET" : "Impossible de récupérer votre adresse mail !",
		        "INTERNAL_SERVER_ERROR" : "Une erreur interne est survenue, mercei de réessayer ultérieument.",
		        // Client side translation keys
		        "DEFAULT_HEADER_TEXT" : "Je suis un titre",
		        "DEFAULT_CALL_ACTION_TEXT" : "Je suis un call to action",
		        "DEFAULT_SUB_TEXT" : "Je suis un sous titre",
		        "DEFAULT_EMAIL_PLACEHOLDER" : "Votre email",
		        "DEFAULT_SUCCESS_TEXT" : "Merci bien, à très bientôt !",
		        "DEFAULT_ERROR_TEXT" : "Erreur inconnue, si vous avez un moment, merci de nous prévenir à travers le <a ng-href='https://hugo.maugey.fr/fr/contact'>formulaire de contact</a>.<br> Désolé pour le désagrément."
		 	});

		}
	]);
