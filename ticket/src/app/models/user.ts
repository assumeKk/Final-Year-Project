/**
 * This is model class to define user roles.
 */
export class User {

  constructor(

    public firstname: string,
    public lastname: string,
    public role?: number
  ) { }

}

export class Lab {

  public startDate: any;
  public endDate: any;
  public time: any = [];

  public name: string;
  public location: string;
}

export class Semester {
  public startDate: any;
  public endDate: any;

  public name;
}