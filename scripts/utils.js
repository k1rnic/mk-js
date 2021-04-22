export default class Utils {
  static getRandom = (range) => Math.ceil(Math.random() * range);
  static getTime = () => new Date().toLocaleTimeString();
}
