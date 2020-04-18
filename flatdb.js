const fs = require('fs');

class DB {
  constructor(file) {
    this.file = file;
    if (!fs.existsSync(this.file)) {
      this.db = {
        version: 0,
        entries: {},
      };
      this.save();
    } else {
      this.db = JSON.parse(fs.readFileSync(this.file).toString());
    }
  }

  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.db, null, 2));
  }

  get(key) {
    const entry = this.db.entries[key];
    if (!entry) return null;
    if (new Date().getTime() > entry.expiry) return null;
    return entry.value;
  }

  set(key, value, expiry = 60 * 1000) {
    const entry = {
      value,
      expiry: new Date().getTime() + expiry,
    };
    this.db.entries[key] = entry;
    this.save();
  }
}

module.exports = DB;
