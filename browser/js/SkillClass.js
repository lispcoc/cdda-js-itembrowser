var all_skill_data = [];

class SkillClass {
    static initAllSkillData() {
        all_skill_data = [];
        for (var skill of skills) {
            var s = new SkillClass(skill);
            s.init();
            s.is_mod_skill = false;
        }
        for (var skill of mod_skills) {
            var s = new SkillClass(skill);
            s.init();
            s.is_mod_skill = true;
        }
    }

    static searchData(ident) {
        var res = null;
        all_skill_data.forEach(function(s) {
            if (s.ident == ident) {
                res = s;
            }
        });
        return res;
    }

    static getAllData() {
        return all_skill_data;
    }

    constructor(jo) {
        this.json = jo;
        if (jo.ident) {
            this.ident = jo.ident;
        } else {
            this.ident = null;
            return;
        }
        all_skill_data.push(this);
    }

    init() {

    }

    get name() {
        return this.json.name ? this.json.name : Tr("No name skill");
    }

    get info() {
        if (this.json.info) {
            return this.json.info;
        } else if (this.json.description) {
            return this.json.description;
        }
        return Tr("No description.");
    }
}