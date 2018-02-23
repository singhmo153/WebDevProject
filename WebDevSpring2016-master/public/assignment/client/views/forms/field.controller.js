"use strict";

(function() {
    angular
        .module("FormBuilderApp")
        .controller("FieldsController", FieldsController);

    function FieldsController($rootScope, $scope, $routeParams, FieldService) {

        $scope.formId = $routeParams.formId;
        $scope.formTitle = $rootScope.currentUser.formName;
        $scope.formFields = {};

        $scope.dialog = {};

        $scope.fieldOptions = [
            "Single Line Text Field",
            "Multi Line Text Field",
            "Date Field",
            "Dropdown Field",
            "CheckBoxes Field",
            "Radio Buttons Field"
        ];

        if($rootScope.currentUser != null) {
            FieldService.getFieldsForForm($scope.formId)
                .then(function(fields){
                    $scope.formFields = fields;
                });
        }

        $scope.deleteField = function(fieldId) {
            FieldService.deleteFieldFromForm($scope.formId,fieldId)
                .then(function(response){
                    $scope.formFields = response;
                });
        }

        $scope.cloneField = function(field) {
            FieldService.createFieldForForm($scope.formId,field)
                .then(function (response) {
                    $scope.formFields = response;
                });
        }

        $scope.editField = function(fieldId) {
            FieldService.getFieldForForm($scope.formId,fieldId)
                .then(function(response){
                    $scope.dialog = response;
                    $scope.dialogFor = response.label;
                    if(response.hasOwnProperty("options")) {
                        $scope.dialog.options = JSON.stringify($scope.dialog.options);
                    }
                });
        }

        $scope.updateField = function(field) {
            if(field.hasOwnProperty("options")){
                field.options = JSON.parse(field.options);
            }
            FieldService.updateField($scope.formId, field._id, field)
                .then(function(response){
                    $scope.formFields = response;
                });
        }

        $scope.$watch('formFields', function (newVal, oldVal) {
            if(Object.keys(newVal).length !== 0 && Object.keys(oldVal).length !== 0 ){
                FieldService.rearrangeFields($scope.formId, newVal)
                    .then(function (response) {
                        $scope.formFields = response;
                    });
            }
        }, true);

        $scope.addField = function(fieldType) {
            if(fieldType != null) {
                var newField = {};
                if (fieldType == "Single Line Text Field") {
                    newField = {"label": "New Text Field", "type": "TEXT", "placeholder": "New Field"};
                }
                else if (fieldType == "Multi Line Text Field") {
                    newField = {"label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field"};
                }
                else if (fieldType == "Date Field") {
                    newField = {"label": "New Date Field", "type": "DATE"};
                }
                else if (fieldType == "Dropdown Field") {
                    newField = {
                            "label": "New Dropdown", "type": "OPTIONS", "options": [
                            {"label": "Option 1", "value": "OPTION_1"},
                            {"label": "Option 2", "value": "OPTION_2"},
                            {"label": "Option 3", "value": "OPTION_3"}
                        ]
                    };
                }
                else if (fieldType == "CheckBoxes Field") {
                    newField = {
                            "label": "New Checkboxes", "type": "CHECKBOXES", "options": [
                            {"label": "Option A", "value": "OPTION_A"},
                            {"label": "Option B", "value": "OPTION_B"},
                            {"label": "Option C", "value": "OPTION_C"}
                        ]
                    };
                }
                else if (fieldType == "Radio Buttons Field") {
                    newField = {
                            "label": "New Radio Buttons", "type": "RADIOS", "options": [
                            {"label": "Option X", "value": "OPTION_X"},
                            {"label": "Option Y", "value": "OPTION_Y"},
                            {"label": "Option Z", "value": "OPTION_Z"}
                        ]
                    };
                }

                FieldService.createFieldForForm($scope.formId, newField)
                    .then(function (response) {
                        $scope.formFields = response;
                    })
            }
        }
    }
})();