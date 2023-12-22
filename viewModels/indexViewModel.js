export class IndexViewModel {
    constructor(id, name, releaser, report_date, consignment, selection, filePath) {
        this.id = id;
        this.name = name;
        this.releaser = releaser;
        this.report_date = report_date;
        this.consignment = consignment;
        this.selection = selection;
        this.filePath = filePath;
    }
}