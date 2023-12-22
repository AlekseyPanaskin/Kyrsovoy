export class IndexViewModel {
    constructor(name, releaser, report_date, consignment, selection, filePath) {
        this.name = name;
        this.releaser = releaser;
        this.report_date = report_date;
        this.consignment = consignment;
        this.selection = selection;
        this.filePath = filePath;
    }
}