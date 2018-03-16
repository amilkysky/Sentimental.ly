const dbModule = require('../')

const Profile = dbModule.db.Model.extend({
  tableName: 'profiles',
  auths: function () {
    return this.hasMany('Auth')
  }
})

module.exports = dbModule.db.model('Profile', Profile)
