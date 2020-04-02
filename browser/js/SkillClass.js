class SkillClass extends GenericClass {
    static get all_json() {
        return skills;
    }

    static get all_mod_json() {
        return mod_skills;
    }

    get id() {
        return this.json.ident ? this.json.ident : null;
    }

    get name() {
        if (this.json.name) {
            if (this.json.name.str) {
                return __(this.json.name.str);
            }
            return __(this.json.name);
        }
        return Tr("No name skill");
    }

    get info() {
        if (this.json.info) {
            return __(this.json.info);
        } else if (this.json.description) {
            return __(this.json.description);
        }
        return Tr("No description.");
    }
}