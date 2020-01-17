// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for the UserEmailPreferencesService.
 */

import { UpgradedServices } from 'services/UpgradedServices';

require('pages/exploration-editor-page/services/user-email-preferences.service.ts');

describe('User Email Preferences Service', function() {
  var UserEmailPreferencesService = null;
  var httpBackend = null;
  var expId = '12345';
  var requestParamsFeedback = {
      message_type: 'feedback',
      mute: false
  }
  var requestParamsSuggestion = {
      message_type: 'suggestion',
      mute: false
  }
  var sampleResponse = {
    email_preferences: {
        mute_feedback_notifications: false,
        mute_suggestion_notifications: false
    }
  }
    
  beforeEach(angular.mock.module('oppia'));

  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));

  beforeEach(function() {
    angular.mock.module(function($provide) {
      $provide.value('ExplorationDataService', {
        explorationId: expId
      });
    });
  });

  beforeEach(angular.mock.inject(function($injector) {
    UserEmailPreferencesService = $injector.get('UserEmailPreferencesService');
  }));

  it('should successfully intialise the service', function() {
    expect(UserEmailPreferencesService.feedbackNotificationsMuted).toBeUndefined();
    expect(UserEmailPreferencesService.suggestionNotificationsMuted).toBeUndefined();

    UserEmailPreferencesService.init(true, true);

    expect(UserEmailPreferencesService.feedbackNotificationsMuted).toBe(true);
    expect(UserEmailPreferencesService.suggestionNotificationsMuted).toBe(true);
  });

  it('should successfully return the feedbackNotificationsMuted value', function() {
    UserEmailPreferencesService.init(true, true);
    expect(UserEmailPreferencesService.areFeedbackNotificationsMuted()).toBe(true);
  });
  
  it('should successfully return the suggestionNotificationsMuted value', function() {
    UserEmailPreferencesService.init(true, true);
    expect(UserEmailPreferencesService.areSuggestionNotificationsMuted()).toBe(true);
  });

  describe('Testing backend related functions', function() {
    beforeEach(angular.mock.inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
      }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should successfully set the feedback notification preferences', function() {
      httpBackend.expectPUT('/createhandler/notificationpreferences/' + expId, requestParamsFeedback).respond(
        200, sampleResponse);
      UserEmailPreferencesService.setFeedbackNotificationPreferences(false);
      httpBackend.flush();
      expect(UserEmailPreferencesService.areFeedbackNotificationsMuted()).toBe(false);
    });
  });

});


