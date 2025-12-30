import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../share/shared.module';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TreatmentsService } from '../../../_services/treatments.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from './../../../_services/main.service';

@Component({
  selector: 'app-treatment-template',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './treatment-template.component.html',
  styleUrl: './treatment-template.component.css'
})
export class TreatmentTemplateComponent implements OnInit {

  constructor(
    private treatmentsService: TreatmentsService,
    private toastR: ToastrService,
    private activeRoute: ActivatedRoute,
    private mainService: MainService,
    private router: Router
  ) { }

  model: any = [];
  showBox = false;
  showNewQuestionBox = false;
  questionType = [
    "Check",
    "Text",
    "Multi select",
    "Paragraph",
    "Combo",
    "Label",
    "Radio",
    "check Text",
    "textCombo",
    "Editor",
  ];
  editOrNewTemplate: any;
  editOrNewSection: any = -1;
  sectionsList: any = [];
  ngOnInit() {
    this.editOrNewTemplate = +this.activeRoute.snapshot.paramMap.get('id') || -1;
    if (this.editOrNewTemplate != -1) {
      this.getTreatmentTemplate();
      this.getSections();
    }

  }

  async getTreatmentTemplate() {
    try {
      let model = {
        id: this.editOrNewTemplate
      }
      let res: any = await this.treatmentsService.getTreatmentTemplates(model).toPromise();
      this.model.name = res[0]['name'];
      this.model.printTemplate = res[0]['printTemplate'];
      this.model.ordering = res[0]['ordering'];
    }
    catch { }
  }


  toggleBox() {
    this.showBox = true;
    this.showNewQuestionBox = false;
  }

  closeBox() {
    this.showBox = false;
  }

  addNewQuestion() {
    this.showNewQuestionBox = true;
  }


  async saveTreatmentTemplate() {
    let model = {
      name: this.model.name,
      templateNotes: null,
      title: null,
      showPatientBirthDate: false,
      showPatientReferenceNumber: false,
      printTemplate: this.model.printTemplate,
      ordering: this.model.ordering,
      editOrNew: this.editOrNewTemplate
    }
    try {
      let res: any = await firstValueFrom(this.treatmentsService.saveTreatmentTemplate(model));
      if (res.status == 0) {
        this.toastR.success('با موفقیت ثبت شد!');
        if (this.editOrNewTemplate == -1) {
          this.editOrNewTemplate = res.data
          this.router.navigate(['/treatment-template/' + this.editOrNewTemplate]);
          this.getTreatmentTemplate();
          this.getSections();
        }
      } else {
        this.toastR.error('خطایی رخ داده است');
      }
    } catch (error) {
      this.toastR.error('خطایی رخ داده است');
    }
  }

  async getSections() {
    let model = {
      // "id": this.editOrNewTemplate
      "id": null
    }
    let res: any = await firstValueFrom(this.mainService.getSections(model));
    this.sectionsList = res;
  }

  async saveSection() {
    let model = {
      treatmentTemplateId: this.editOrNewTemplate,
      title: this.model.groupTitle,
      defaultClose: this.model.defaultClose,
      order: null,
      isDeleted: false,
      horizontalDirection: this.model.horizontalDisplay,
      editOrNew: this.editOrNewSection
    }
    try {
      let res: any = await firstValueFrom(this.mainService.saveSection(model));
      if (res.status == 0) {
        this.toastR.success('با موفقیت ثبت شد!');
        this.getSections();
      } else {
        this.toastR.error('خطایی رخ داده است');
      }
    } catch (error) {
      this.toastR.error('خطایی رخ داده است');
    }
  }

}
