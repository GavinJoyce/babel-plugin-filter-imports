import Em from 'ember';
import Ember from 'ember';

Em.assert('this will be stripped');
Em.debug('this will also be stripped');

Ember.assert('this will be stripped');
Ember.debug('this also will be stripped');

Em.isEmpty(); //this should remain
Ember.isEmpty(); //this should remain
