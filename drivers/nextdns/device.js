'use strict';

const Homey = require('homey');

module.exports = class ProfileDevice extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.homey.setInterval(() => this.driver.checkStatus(this).catch(this.error), 15000);
    const addBlocklistAction = this.homey.flow.getActionCard('add_blocklist');
    addBlocklistAction.registerRunListener(async (args, state) => {
      try {
        const result = await this.driver.addBlocklist(args.domain,this);
        return result;
      } catch (error) {
        throw new Error('Error adding domain to blocklist: ' + error.message);
      }
    });
    const removeBlocklistAction = this.homey.flow.getActionCard('remove_blocklist');
    removeBlocklistAction.registerRunListener(async (args, state) => {
      try {
        const result = await this.driver.removeBlocklist(args.domain,this);
        return result;
      } catch (error) {
        throw new Error('Error adding domain to blocklist: ' + error.message);
      }
    });
    const addWhitelistAction = this.homey.flow.getActionCard('add_whitelist');
    addWhitelistAction.registerRunListener(async (args, state) => {
      try {
        const result = await this.driver.addWhitelist(args.domain,this);
        return result;
      } catch (error) {
        throw new Error('Error adding domain to whitelist: ' + error.message);
      }
    });
    const removeWhitelistAction = this.homey.flow.getActionCard('remove_whitelist');
    removeWhitelistAction.registerRunListener(async (args, state) => {
      try {
        const result = await this.driver.removeWhitelist(args.domain,this);
        return result;
      } catch (error) {
        throw new Error('Error adding domain to whitelist: ' + error.message);
      }
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    try {
      await this.driver.checkStatus(this);
    } catch (error) {
      this.error("Error while checking device status on add: " + error.message);
    }
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    try {
      await this.driver.checkStatus(this);
    } catch (error) {
      this.error("Error while checking device status on settings change: " + error.message);
    }
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('Profile device was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Profile device has been deleted');
  }

};
