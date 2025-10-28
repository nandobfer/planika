export declare const templates: {
    mail: {
        inviteParticipant: (trip: import("../class/Trip/Trip").Trip, data: import("../class/Trip/TripParticipant").TripParticipant) => string;
        passwordRecovery: (code: string, user: import("../class/User").User) => string;
    };
};
