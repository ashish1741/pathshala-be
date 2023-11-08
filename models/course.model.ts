import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: IComment[];
}

interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

interface Ilinks extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: Ilinks[];
    suggestion: string;
    question: IComment[];
}

interface Icourse extends Document {
    name: String;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumnail: object;
    tag: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequistites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
    assigment:{title:any}[],
    submission:{title:any}[],
}

interface IAssignment extends Document {
    title: string;
    description: string;
    dueDate: Date;
    maxScore: number;
    courseID: string;
    submissions: ISubmission[];
};
interface ISubmission {
    userID: string;
    submissionDate: Date;
    fileURL: string;
    score: number;
    feedback: string;
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});

const linkschema = new Schema<Ilinks>({
    title: String,
    url: String,
});

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Array],
});

const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    title: String,
    description:String,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkschema],
    suggestion: String,
    question: [commentSchema],
    

});

const SubmissionSchema = new Schema<ISubmission>({
    // userID: { type: Schema.Types.ObjectId, ref: 'User' },
    submissionDate: { type: Date, default: Date.now },
    fileURL: String,
    score: Number,
    feedback: String
});
const AssignmentSchema = new Schema<IAssignment>({
    title: String,
    description: String,
    dueDate: Date,
    maxScore: Number,
    // courseID: { type: Schema.Types.ObjectId, ref: 'Course' },
    submissions: [SubmissionSchema]
});

const courseSchema = new Schema<Icourse>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    tag: {
        type: String,
        require: true,
    },
    level: {
        type: String,
        require: true,
    },
    demoUrl: {
        type: String,
        require: true,
    },

    benefits: [{ title: String }],
    prerequistites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    assigment:[AssignmentSchema],
    submission:[SubmissionSchema],

    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },

});





const CourseModel:Model<Icourse> = mongoose.model("course",courseSchema);
export default CourseModel