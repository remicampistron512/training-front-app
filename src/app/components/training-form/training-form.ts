import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { Training } from '../../model/training/training.model'; // adjust path

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.html',
  imports: [
    FormsModule
  ]
})
export class TrainingFormComponent {
  // Default model (id often assigned by backend, so set 0 or omit server-side)
  defaultModel: Training = new Training(0, '', '', 0, 0);

  model: Training = { ...this.defaultModel };

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    // Payload to send to API
    const newTraining: Training = new Training(
      0, // backend usually generates
      this.model.name,
      this.model.description,
      Number(this.model.price),
      Number(this.model.quantity)
    );

    console.log('Submitting:', newTraining);

    // TODO: call your service:
    // this.trainingService.create(newTraining).subscribe(...);

    form.resetForm(this.defaultModel);
  }
}
