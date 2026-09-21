(() => {
    "use strict";

    const ageForm = document.getElementById("ageForm");
    const daySelect = document.getElementById("birthDaySelect");
    const monthSelect = document.getElementById("birthMonthSelect");
    const yearSelect = document.getElementById("birthYearSelect");
    const errorMessage = document.getElementById("errorMessage");

    const resultSection = document.getElementById("resultSection");
    const ageYears = document.getElementById("ageYears");
    const resultYears = document.getElementById("resultYears");
    const resultMonths = document.getElementById("resultMonths");
    const resultDays = document.getElementById("resultDays");
    const nextBirthday = document.getElementById("nextBirthday");
    const birthdayCountdown = document.getElementById("birthdayCountdown");
    const totalDays = document.getElementById("totalDays");
    const totalWeeks = document.getElementById("totalWeeks");
    const birthDay = document.getElementById("birthDay");
    const resetButton = document.getElementById("resetButton");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function fillDays(maxDays, keepValue = true) {
        const previousValue = keepValue ? daySelect.value : "";
        daySelect.innerHTML = '<option value="">Day</option>';

        for (let day = 1; day <= maxDays; day++) {
            const option = document.createElement("option");
            option.value = String(day);
            option.textContent = String(day);
            daySelect.appendChild(option);
        }

        if (previousValue && Number(previousValue) <= maxDays) {
            daySelect.value = previousValue;
        }
    }

    function fillYears() {
        const currentYear = today.getFullYear();
        const firstYear = currentYear - 120;
        const fragment = document.createDocumentFragment();

        for (let year = currentYear; year >= firstYear; year--) {
            const option = document.createElement("option");
            option.value = String(year);
            option.textContent = String(year);
            fragment.appendChild(option);
        }

        yearSelect.appendChild(fragment);
    }

    function updateDays() {
        const month = Number(monthSelect.value);
        const year = Number(yearSelect.value);

        if (!month) {
            fillDays(31);
            return;
        }

        const maxDays = year ? daysInMonth(year, month) : 31;
        fillDays(maxDays);
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = "";
    }

    function dateOnly(year, month, day) {
        return new Date(year, month, day);
    }

    function calculateAge(birthDate, now) {
        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const previousMonthDays = new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            ).getDate();
            days += previousMonthDays;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    function calculateNextBirthday(birthDate, now) {
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        let nextYear = now.getFullYear();
        let birthday = dateOnly(nextYear, birthMonth, birthDay);

        if (birthday < now) {
            nextYear++;
            birthday = dateOnly(nextYear, birthMonth, birthDay);
        }

        const difference = birthday.getTime() - now.getTime();
        const daysRemaining = Math.ceil(difference / 86400000);

        nextBirthday.textContent = birthday.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        if (daysRemaining <= 0) {
            birthdayCountdown.textContent = "Birthday today";
        } else if (daysRemaining === 1) {
            birthdayCountdown.textContent = "1 day remaining";
        } else {
            birthdayCountdown.textContent = `${daysRemaining} days remaining`;
        }
    }

    function renderResult(birthDate, now) {
        const age = calculateAge(birthDate, now);

        ageYears.textContent = age.years;
        resultYears.textContent = age.years;
        resultMonths.textContent = age.months;
        resultDays.textContent = age.days;

        const start = Date.UTC(
            birthDate.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        );
        const end = Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const daysLived = Math.floor((end - start) / 86400000);
        const weeksLived = Math.floor(daysLived / 7);

        totalDays.textContent = daysLived.toLocaleString("en-US");
        totalWeeks.textContent = weeksLived.toLocaleString("en-US");
        birthDay.textContent = birthDate.toLocaleDateString("en-US", {
            weekday: "long"
        });

        calculateNextBirthday(birthDate, now);

        resultSection.classList.add("show");

        window.setTimeout(() => {
            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 80);
    }

    monthSelect.addEventListener("change", updateDays);
    yearSelect.addEventListener("change", updateDays);

    ageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearError();

        const day = Number(daySelect.value);
        const month = Number(monthSelect.value);
        const year = Number(yearSelect.value);

        if (!day || !month || !year) {
            showError("Please select your complete date of birth.");
            return;
        }

        const maxDay = daysInMonth(year, month);
        if (day > maxDay) {
            showError("Please select a valid date.");
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        birthDate.setHours(0, 0, 0, 0);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (birthDate > now) {
            showError("Date of birth cannot be in the future.");
            return;
        }

        renderResult(birthDate, now);
    });

    resetButton.addEventListener("click", () => {
        daySelect.value = "";
        monthSelect.value = "";
        yearSelect.value = "";
        clearError();
        resultSection.classList.remove("show");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    fillDays(31, false);
    fillYears();
})();
